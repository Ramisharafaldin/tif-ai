import os
import re

# Read the skills catalog with error handling
with open('C:\\Users\\pc\\OneDrive\\Desktop\\TIF\\TIF-AI\\docs\\skills_catalog.md', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Split by agent sections (## )
# We'll split by '## ' but keep the delimiter
sections = re.split(r'\n## ', content)
# The first section is the header before any agent
# We'll skip it
for section in sections[1:]:
    # Split the section into lines
    lines = section.split('\n')
    # The first line is the agent name
    agent_line = lines[0].strip()
    # Convert agent name to a module name: lowercase, replace spaces with underscores, remove special characters
    module = re.sub(r'[^a-z0-9]+', '_', agent_line.lower()).strip('_')
    # Create the directory for this module under skills/
    module_dir = os.path.join('skills', module)
    os.makedirs(module_dir, exist_ok=True)
    
    # The rest of the section contains the skills
    # We'll join the lines back and then split by '### ' to get each skill
    section_content = '\n'.join(lines[1:])
    skill_blocks = re.split(r'\n### ', section_content)
    for skill_block in skill_blocks:
        if not skill_block.strip():
            continue
        # The first line of the skill block is the skill title (e.g., "1. calculate_kpis.skill.md")
        skill_lines = skill_block.split('\n')
        skill_title_line = skill_lines[0].strip()
        # Extract the skill name (remove the leading number and the .skill.md)
        match = re.match(r'\d+\.\s+(.*)\.skill\.md', skill_title_line)
        if match:
            skill_name = match.group(1)
        else:
            # If the pattern doesn't match, skip
            continue
        # The skill content is the rest of the lines
        skill_content = '\n'.join(skill_lines[1:])
        # Write the skill file
        skill_file_path = os.path.join(module_dir, f'{skill_name}.skill.md')
        with open(skill_file_path, 'w', encoding='utf-8') as sf:
            # Write the skill title as a heading
            sf.write(f'# {skill_title_line}\n\n')
            sf.write(skill_content)
        print(f'Created {skill_file_path}')
