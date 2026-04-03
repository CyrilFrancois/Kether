import os
import json
import logging
from typing import List, Dict, Any
from .llm_client import LLMClient  # Standardized wrapper for LLM calls

logger = logging.getLogger(__name__)

class DecompositionExecutor:
    def __init__(self):
        self.llm = LLMClient()
        self.prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', 'decomposition.txt')

    def _load_prompt(self) -> str:
        with open(self.prompt_path, 'r') as f:
            return f.read()

    def _format_attributes(self, attributes: List[Dict]) -> str:
        """Converts the EAV attribute list into a readable string for the LLM."""
        if not attributes:
            return "No specific constraints defined."
        
        formatted = []
        for attr in attributes:
            formatted.append(f"- {attr.get('key')}: {attr.get('value')} ({attr.get('type')})")
        return "\n".join(formatted)

    async def execute_decomposition(self, parent_node: Dict[str, Any], root_project: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Triggers the AI to generate sub-nodes based on parent context and global project constraints.
        """
        try:
            # 1. Prepare the dynamic prompt context
            raw_prompt = self._load_prompt()
            
            # 2. Inject Variables
            # We explicitly pull the domain and attributes from the root_project
            # to ensure consistent project-wide constraints.
            context = {
                "project_domain": root_project.get('domain', 'General'),
                "project_attributes": self._format_attributes(root_project.get('attributes', [])),
                "parent_name": parent_node.get('name'),
                "parent_description": parent_node.get('description'),
                "parent_level": parent_node.get('level'),
                "target_level": parent_node.get('level') + 1
            }

            final_prompt = raw_prompt
            for key, value in context.items():
                placeholder = "{{" + key + "}}"
                final_prompt = final_prompt.replace(placeholder, str(value))

            # 3. Call LLM
            response_text = await self.llm.generate(final_prompt)
            
            # 4. Clean and Parse JSON
            # Handles cases where the LLM might wrap the JSON in markdown blocks
            clean_json = response_text.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json.split("```json")[1].split("```")[0].strip()
            elif clean_json.startswith("```"):
                clean_json = clean_json.split("```")[1].split("```")[0].strip()

            sub_nodes = json.loads(clean_json)

            # 5. Post-process to ensure level and structural integrity
            for node in sub_nodes:
                node['parent_id'] = parent_node.get('id')
                node['level'] = context['target_level']
                if 'attributes' not in node:
                    node['attributes'] = []

            return sub_nodes

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {response_text}")
            raise Exception("AI generated an invalid data structure. Please try again.")
        except Exception as e:
            logger.error(f"Decomposition execution error: {str(e)}")
            raise e

executor = DecompositionExecutor()