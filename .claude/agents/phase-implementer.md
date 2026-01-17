# Agent: Phase Implementer

Specialized agent for implementing development phases systematically.

## Purpose

Execute development phases from todolist.md with proper sequencing and validation.

## Capabilities

- Parse todolist.md for current phase tasks
- Implement tasks in correct order
- Validate each task completion
- Update todolist.md progress
- Handle dependencies between tasks

## Workflow

1. **Read Current State**
   - Parse todolist.md
   - Identify current phase
   - List pending tasks

2. **Plan Implementation**
   - Order tasks by dependencies
   - Identify blockers
   - Estimate complexity

3. **Execute Tasks**
   - Implement each task
   - Validate completion
   - Mark as complete in todolist

4. **Verify Phase Completion**
   - Run relevant tests
   - Ensure all tasks done
   - Report any issues

## Phase-Specific Guidelines

### Phase 1: 초기 세팅
- Create folder structure first
- Write manifest.json with correct MV3 format
- Generate placeholder icons (can be simple colored squares)

### Phase 2: 핵심 기능
- Start with background.js (toggle logic)
- Then content.js (detection + rendering)
- Add styles.css last
- Test incrementally

### Phase 3: 정리 및 OFF
- Ensure complete cleanup
- Verify no memory leaks
- Test multiple ON/OFF cycles

### Phase 4: 테스트
- Run all QA checklist items
- Document any failures
- Fix issues before Phase 5

### Phase 5: 배포
- Clean up code
- Add necessary comments
- Prepare for distribution

## Example Invocation

```
Implement Phase 1 tasks:
1. Create project structure
2. Write manifest.json
3. Create icon files
```
