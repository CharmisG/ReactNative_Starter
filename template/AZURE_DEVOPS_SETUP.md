# Azure DevOps Pipeline Setup Guide

This guide will help you set up the Azure DevOps pipeline for your React Native project.

## Prerequisites

- Azure DevOps account (free tier available)
- Repository in Azure Repos or connected to Azure DevOps
- Basic understanding of YAML pipelines

## Quick Start

### Step 1: Create Pipeline

1. Go to your Azure DevOps project
2. Navigate to **Pipelines** → **Pipelines**
3. Click **New pipeline**
4. Select your repository source (Azure Repos, GitHub, etc.)
5. Choose **Existing Azure Pipelines YAML file**
6. Select the branch and path: `azure-pipelines.yml`
7. Click **Continue** and then **Run**

### Step 2: Configure Pipeline

The pipeline is already configured with:
- ✅ Node.js 18.x
- ✅ Java 17
- ✅ macOS build agents
- ✅ Automatic triggers on main/dev branches
- ✅ Pull request validation

### Step 3: Customize (Optional)

#### Update App Name

If your app name is not "ProjectName", update in `azure-pipelines.yml`:

```yaml
- task: Xcode@5
  inputs:
    scheme: 'YourAppName'  # Change here
    workspace: 'ios/YourAppName.xcworkspace'  # Change here
```

#### Update Package Name

Update Android package name if needed in your `android/app/build.gradle` file.

## Pipeline Stages

### 1. Install Stage
- Sets up Node.js
- Installs npm dependencies
- Runs on every build

### 2. Test Stage
- Runs test suite
- Generates coverage reports
- Continues even if tests fail
- Depends on Install stage

### 3. Build Android Stage
- Sets up Java and Android SDK
- Builds Android APK (Debug)
- Publishes APK as artifact
- Only runs on main/dev branches
- Depends on Lint and Test stages

## Artifacts

After a successful build, you can download:
- **android-debug-apk**: Android APK file from Build Android stage

To download artifacts:
1. Go to the completed pipeline run
2. Click on **Artifacts** tab
3. Download the artifact you need

## Variables

### Built-in Variables

The pipeline uses these built-in Azure DevOps variables:
- `Build.SourceBranch` - Current branch name
- `System.DefaultWorkingDirectory` - Working directory

### Custom Variables

You can add custom variables in:
1. **Pipeline Settings** → **Variables**
2. Or in the YAML file:

```yaml
variables:
  NODE_VERSION: '18.x'
  JAVA_VERSION: '17'
  CUSTOM_VAR: 'value'
```

## Secrets and Secure Variables

To add secrets (like API keys, passwords):

1. Go to **Pipelines** → **Library**
2. Click **+ Variable group** or **+ Secure file**
3. Add your secrets
4. Reference in pipeline:

```yaml
variables:
  - group: 'my-secrets'  # Variable group name
```

Or use individual variables:
```yaml
variables:
  - name: MY_SECRET
    value: $(MY_SECRET)  # Set in Pipeline Variables
```

## Triggers

### Automatic Triggers

The pipeline automatically runs on:
- Push to `main` branch
- Push to `dev` branch
- Pull requests to `main` or `dev`

### Manual Triggers

To run manually:
1. Go to **Pipelines**
2. Click on your pipeline
3. Click **Run pipeline**
4. Select branch and click **Run**

### Disable Triggers

To disable automatic triggers, comment out the trigger section:

```yaml
# trigger:
#   branches:
#     include:
#       - main
```

### Agent Specifications

- **OS**: macOS (latest)
- **Node.js**: 18.x (installed via task)
- **Java**: 17 (installed via task)
- **Xcode**: Available for iOS builds

## Common Customizations

### Add Deployment Stage

```yaml
- stage: Deploy
  displayName: 'Deploy to Store'
  dependsOn: [BuildAndroid, BuildiOS]
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
    - job: DeployAndroid
      displayName: 'Deploy Android'
      steps:
        - script: |
            echo "Deploy to Play Store"
            # Add your deployment commands
          displayName: 'Deploy Android'
```

### Add Notifications

Add notification tasks:

```yaml
- task: SlackNotification@1
  inputs:
    webhookUrl: '$(SLACK_WEBHOOK_URL)'
    message: 'Build completed'
```

### Add Code Coverage

```yaml
- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'Cobertura'
    summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml'
```

## Troubleshooting

### Build Fails on Install

**Issue**: npm install fails
**Solution**:
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Check package.json for errors

### Android Build Fails

**Issue**: Gradle build fails
**Solution**:
- Ensure `android/gradlew` is executable
- Check Android SDK is available
- Verify `android/app/build.gradle` is correct

### iOS Build Fails

**Issue**: Xcode build fails
**Solution**:
- Check CocoaPods installation: `cd ios && pod install`
- Verify workspace and scheme names match
- Ensure Xcode is available on agent

### Pipeline Not Triggering

**Issue**: Pipeline doesn't run automatically
**Solution**:
- Check branch name matches trigger configuration
- Verify YAML file is in repository root
- Check pipeline is enabled in settings

### Out of Memory

**Issue**: Build runs out of memory
**Solution**:
- Use larger agent (if available)
- Optimize build process
- Clear caches between builds

## Best Practices

1. **Use Caching**: Cache node_modules and Gradle dependencies
2. **Fail Fast**: Set `continueOnError: false` for critical stages
3. **Artifact Retention**: Configure artifact retention policies
4. **Security**: Never commit secrets, use Azure DevOps variables
5. **Testing**: Test pipeline changes on feature branches first
6. **Documentation**: Keep pipeline YAML well-commented

## Example: Add Caching

```yaml
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    restoreKeys: |
      npm | "$(Agent.OS)"
    path: node_modules
  displayName: 'Cache node_modules'
```

## Example: Conditional Builds

```yaml
- stage: BuildAndroid
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  # Only builds on main branch
```

## Resources

- [Azure Pipelines Documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
- [YAML Pipeline Reference](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)
- [React Native CI/CD Guide](https://reactnative.dev/docs/signed-apk-android)

## Support

For issues:
1. Check Azure DevOps pipeline logs
2. Review YAML syntax
3. Test commands locally first
4. Check Azure DevOps status page

---

**Last Updated**: 2024

