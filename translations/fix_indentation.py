import sys
import re

def fix_indentation(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    # Simplified logic: 
    # For each line, if it's 4-space indented or more, we try to detect if it's too much.
    # Actually, a better way is to use a formatter, but since we don't have one,
    # we'll do a simple regex replacement for the common mistake: 4 spaces -> 2 spaces at the top level?
    # No, let's just use a more targeted approach for the blocks we know are wrong.
    
    # We'll use a more advanced logic: track brace level and enforce 2-space per level.
    indent_size = 2
    level = 0
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            new_lines.append('\n')
            continue
            
        # Adjust level before processing line if it starts with closing brace
        if stripped.startswith('}') or stripped.startswith(']'):
            level = max(0, level - 1)
            
        # Apply indentation
        new_indent = ' ' * (level * indent_size)
        
        # Special case for the export const line
        if 'export const' in line:
            new_lines.append(line)
            level = 1
            continue
            
        new_lines.append(new_indent + stripped + '\n')
        
        # Adjust level after processing line if it ends with opening brace
        if stripped.endswith('{') or stripped.endswith('[') or stripped.endswith('},') or stripped.endswith('],'):
            # This is tricky because of things like },
            # If it ends with { or [, we increase level.
            # If it contains both { and } on same line (empty object), don't change.
            if '{' in stripped and '}' not in stripped:
                level += 1
            elif '[' in stripped and ']' not in stripped:
                level += 1
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

if __name__ == '__main__':
    fix_indentation(sys.argv[1])
