# Contributing to SQL Playground

Thank you for your interest in contributing to SQL Playground! This document provides guidelines and instructions for contributing to this project. We appreciate your time and effort in making SQL Playground better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Templates](#issue-templates)
  - [Bug Report Template](#bug-report-template)
  - [Feature Request Template](#feature-request-template)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others when contributing to this project.

## 🚀 Getting Started

1. **Fork the Repository**
   - Click the "Fork" button on the top right of the repository page
   - Clone your forked repository:
     ```bash
     git clone https://github.com/Harith-Y/SQL-Playground.git
     cd SQL-Playground
     ```

2. **Set Up Development Environment**
   - Install dependencies:
     ```bash
     npm install
     cd client
     npm install
     ```
   - Set up environment variables (see README.md for details)
   - Start the development servers:
     ```bash
     npm run dev:full
     ```

3. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

1. **Keep Your Fork Updated**
   ```bash
   git remote add upstream https://github.com/Harith-Y/SQL-Playground.git
   git fetch upstream
   git pull upstream main
   ```

2. **Make Your Changes**
   - Follow the code style guide
   - Write tests for new features
   - Update documentation as needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 💻 Code Style Guide

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add appropriate type annotations
- Keep functions small and focused
- Use async/await for asynchronous operations

### React Components
- Use functional components with hooks
- Follow the component structure:
  ```typescript
  import React from 'react';
  import { FC } from 'react';
  
  interface Props {
    // Define props here
  }
  
  const ComponentName: FC<Props> = ({ prop1, prop2 }) => {
    // Component logic here
    
    return (
      // JSX here
    );
  };
  
  export default ComponentName;
  ```

### CSS/Styling
- Use Material-UI components and styling
- Follow the theme structure for custom styles
- Use CSS-in-JS for component-specific styles

## 🧪 Testing

- Write unit tests for new features
- Ensure all tests pass before submitting a PR
- Follow the existing test patterns
- Test both success and error cases
- Run tests locally:
  ```bash
  cd client
  npm test
  ```

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions and components
- Document API changes
- Keep the project structure documentation up to date

## 🔄 Pull Request Process

1. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select the appropriate branches
   - Fill in the PR template

2. **PR Requirements**
   - Clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass
   - Update documentation as needed

3. **Review Process**
   - Address review comments
   - Make necessary changes
   - Keep the PR up to date with main

## 📝 Issue Templates

### Bug Report Template

```markdown
## Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- OS: [e.g. Windows 10, macOS 11.2.3]
- Browser: [e.g. Chrome 88, Firefox 85]
- Node.js Version: [e.g. 14.15.4]
- SQL Playground Version: [e.g. 1.0.0]

## Additional Context
Add any other context about the problem here.

## Possible Solution
If you have any ideas about how to fix the bug, please describe them here.
```

### Feature Request Template

```markdown
## Description
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
A clear and concise description of what you want to happen.

## Alternative Solutions
A clear and concise description of any alternative solutions or features you've considered.

## Additional Context
Add any other context or screenshots about the feature request here.

## Implementation Notes
If you have any ideas about how to implement this feature, please describe them here.

## Priority
- [ ] High
- [ ] Medium
- [ ] Low

## Related Issues
List any related issues here.
```

## 🐛 Reporting Bugs

1. **Check Existing Issues**
   - Search the issues to avoid duplicates
   - Check closed issues for solutions

2. **Create a New Issue**
   - Use the bug report template
   - Include:
     - Steps to reproduce
     - Expected behavior
     - Actual behavior
     - Screenshots if applicable
     - Environment details

## ✨ Feature Requests

1. **Check Existing Features**
   - Search issues and PRs
   - Check the roadmap if available

2. **Submit a Feature Request**
   - Use the feature request template
   - Describe the feature
   - Explain the use case
   - Suggest implementation approach

## 📝 Commit Message Guidelines

Follow the conventional commits specification:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

Example:
```
feat(auth): add social login support

- Add Google OAuth integration
- Update login form UI
- Add social login tests

Closes #123
```

## 🤝 Questions?

If you have any questions about contributing, feel free to:
- Open an issue
- Contact the maintainers
- Join our community chat (if available)

Thank you for contributing to SQL Playground! 🎉 