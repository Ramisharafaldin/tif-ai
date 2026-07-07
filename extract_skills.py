import re
import os

with open('docs/skills_catalog.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by '## ' to get sections (each agent)
sections = re.split(r'\n## ', content)
# The first element is the preamble (before any section)
# We'll process each section that contains 'Skills' in its first line.
for section in sections[1:]:  # skip the first which is the document title
    lines = section.split('\n')
    if not lines:
        continue
    # First line of the section is the agent name
    agent_line = lines[0].strip()
    # Check if this is a skills section
    if 'Skills' not in agent_line:
        continue
    # Determine module from agent_line
    # Remove the ' Skills' suffix and any parenthetical like '(Supporting)'
    agent_name = agent_line.replace(' Skills', '').replace(' (Supporting)', '')
    # Convert to lowercase, replace non-alphanumeric with underscore
    module = re.sub(r'[^a-z0-9]+', '_', agent_name.lower())
    # Remove leading/trailing underscores
    module = re.sub(r'^_+|_+$', '', module)
    # The rest of the section is the content after the first line
    section_content = '\n'.join(lines[1:])
    # Now split the section_content by skill headers
    # Pattern for a skill header: newline, then ###, then space, then digits, dot, space, any characters, then .skill.md
    # We'll split by this pattern, keeping the delimiter.
    skill_parts = re.split(r'(\n### \d+\.\s+.*?\.skill\.md)', section_content)
    # The first element might be empty or text before the first skill
    # Then we have pairs: [delimiter1, content1, delimiter2, content2, ...]
    for j in range(1, len(skill_parts), 2):
        if j+1 >= len(skill_parts):
            break
        delimiter = skill_parts[j]  # e.g., '\n### 1. calculate_kpis.skill.md'
        content_part = skill_parts[j+1].strip() if j+1 < len(skill_parts) else ''
        # Extract the skill name from the delimiter
        # Remove the leading '\n### ' and then the trailing '.skill.md'
        # Example: '\n### 1. calculate_kpis.skill.md'
        inner = delimiter.strip()[4:]  # remove '\n### '
        # Now split by '.skill.md'
        if inner.endswith('.skill.md'):
            inner = inner[:-len('.skill.md')]
        # Now remove the leading number and dot and space
        # We'll just take everything after the first space
        parts = inner.split(' ', 1)
        if len(parts) == 2:
            skill_name = parts[1]
        else:
            skill_name = inner  # fallback
        # Create directory for module
        dir_path = os.path.join('skills', module)
        os.makedirs(dir_path, exist_ok=True)
        file_path = os.path.join(dir_path, f'{skill_name}.skill.md')
        # Write the file
        with open(file_path, 'w', encoding='utf-8') as f_out:
            f_out.write(f'# {inner}.skill.md\n\n{content_part}')
        print(f'Created {file_path}')
