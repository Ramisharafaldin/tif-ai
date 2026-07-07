# Transfer Optimization Skill

## Description
Analyzes stock imbalances between branches and generates transfer recommendations to optimize inventory distribution.

## Input
- `branch_id`: optional str — filter by branch

## Output
- `recommendations`: list of dict — from_branch, to_branch, product, quantity, priority
- `alerts`: list of dict — imbalance alerts

## Used By
- TransfersIntelligenceAgent
