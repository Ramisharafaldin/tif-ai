import os
import re

# Read the skills catalog
with open('docs/skills_catalog.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by sections (each agent)
# We'll use a simple approach: split by '## ' and then process each section
# But note that the file has a top-level heading and then sections.
# We'll split by '\n## ' to get the sections.
sections = re.split(r'\n## ', content)
# The first element is the intro before the first section.
# We'll skip it.
for section in sections[1:]:
    # The first line of the section is the section title (agent name)
    lines = section.split('\n')
    agent_name = lines[0].strip()
    # Determine module name from agent name
    # Remove ' Intelligence Agent Skills' or similar
    agent_name = agent_name.replace(' Intelligence Agent Skills', '').replace(' (Supporting)', '')
    # Convert to lowercase and replace spaces with underscores
    module = agent_name.lower().replace(' ', '_')
    # Create directory if not exists
    skill_dir = os.path.join('skills', module)
    os.makedirs(skill_dir, exist_ok=True)
    
    # Now find each skill in the section. Skills are marked by '### '
    # We'll split the section by '### '
    skill_sections = re.split(r'\n### ', '\n'.join(lines[1:]))
    for skill_sec in skill_sections:
        if not skill_sec.strip():
            continue
        # The first line of the skill section is the skill name (e.g., "1. calculate_kpis.skill.md")
        skill_lines = skill_sec.split('\n')
        skill_title = skill_lines[0].strip()
        # Extract the skill name (remove the number and the .skill.md)
        # Example: "1. calculate_kpis.skill.md"
        match = re.match(r'\d+\.\s+(.*)\.skill\.md', skill_title)
        if match:
            skill_name = match.group(1)
        else:
            # If pattern doesn't match, skip
            continue
        # The rest is the skill content
        skill_content = '\n'.join(skill_lines[1:])
        # Create the file
        file_path = os.path.join(skill_dir, f'{skill_name}.skill.md')
        with open(file_path, 'w', encoding='utf-8') as sf:
            # Write the skill content with a header? The original includes the title.
            # We'll write exactly as in the catalog, but we might want to include the title.
            # Let's write the skill title as a heading and then the content.
            sf.write(f'# {skill_title}\n\n')
            sf.write(skill_content)
        print(f'Created {file_path}')
