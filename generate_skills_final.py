import os
import re

def slugify(text):
    # Convert to lowercase, replace non-alphanumeric with underscore, remove leading/trailing underscore
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

# Read the skills catalog
with open('docs/skills_catalog.md', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Split by '## ' to get sections (including the initial part before the first section)
sections = re.split(r'\n## ', content)
# The first element is the preamble (before the first agent section)
# We'll skip it.
agent_sections = sections[1:] if len(sections) > 1 else []

# Mapping from agent name to module name
agent_to_module = {
    'Dashboard Intelligence Agent Skills': 'dashboard',
    'Inventory Intelligence Agent Skills': 'inventory',
    'Forecasting Intelligence Agent Skills': 'forecasting',
    'Transfers Intelligence Agent Skills': 'transfers',
    'Data Management Agent (Supporting) Skills': 'data_management'
}

for section in agent_sections:
    lines = section.split('\n')
    if not lines:
        continue
    agent_line = lines[0].strip()
    # Determine module
    module = None
    for agent_key, mod in agent_to_module.items():
        if agent_key in agent_line:
            module = mod
            break
    if module is None:
        # Fallback: use slugified agent line (without the ' Skills' suffix)
        # Remove trailing ' Skills' if present
        clean = agent_line.replace(' Skills', '').strip()
        module = slugify(clean)
        print(f'Warning: using fallback module {module} for agent line: {agent_line}')
    
    # Create the module directory
    module_dir = os.path.join('skills', module)
    os.makedirs(module_dir, exist_ok=True)
    
    # The rest of the section contains the skills
    # Join the lines back (without the first line) and then split by skill markers
    section_content = '\n'.join(lines[1:])
    # Split by lines that start with a digit, a dot, and then a space and then the skill name ending with .skill.md
    # We'll use a regex to find each skill block.
    # Pattern: r'\n\d+\.\s+[^\n]+\.skill\.md'
    # We want to split on this pattern, but keep the delimiter.
    # We'll instead find all matches and the text between them.
    # Let's split by the pattern and then pair the matches with the following text.
    parts = re.split(r'(\n\d+\.\s+[^\n]+\.skill\.md)', section_content)
    # The first part might be empty or a header; we skip if it's empty.
    # The parts array will be: [preamble, delimiter1, content1, delimiter2, content2, ...]
    # We'll iterate over the delimiters and the following content.
    for i in range(1, len(parts), 2):
        if i+1 >= len(parts):
            break
        delimiter = parts[i]  # e.g., '\n1. calculate_kpis.skill.md'
        content_part = parts[i+1] if i+1 < len(parts) else ''
        # Extract the skill title from the delimiter
        # Remove the leading newline and then split by '.skill.md'
        # Example: '1. calculate_kpis.skill.md'
        title_line = delimiter.strip()
        # Remove the leading number and dot and space
        # We'll just take everything after the first space and before '.skill.md'
        # But safer: use regex
        match = re.match(r'\d+\.\s+(.*)\.skill\.md', title_line)
        if match:
            skill_name = match.group(1)
        else:
            # Fallback: take the whole line and remove the .skill.md and the number
            # Remove the .skill.md suffix
            if title_line.endswith('.skill.md'):
                title_line = title_line[:-len('.skill.md')]
            # Remove leading digits and dot and space
            title_line = re.sub(r'^\d+\.\s*', '', title_line)
            skill_name = title_line.strip()
        # The content for this skill is the content_part until the next delimiter or end.
        # We'll just take the content_part as is (it might have leading/trailing newlines).
        skill_content = content_part.strip()
        # Write the skill file
        file_path = os.path.join(module_dir, f'{skill_name}.skill.md')
        with open(file_path, 'w', encoding='utf-8') as f:
            # Write a header with the skill title (as it appears in the catalog)
            f.write(f'# {title_line}\n\n')
            f.write(skill_content)
        print(f'Created {file_path}')
