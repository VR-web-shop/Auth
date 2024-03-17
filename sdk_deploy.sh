git add .
git commit -m "Prepare deployment"

# Bumb version
npm version patch

# Commit changes
git add .
git commit -m "Bump version"

# Push changes
git push origin main

# Check if the contract release branch exists
if [ -z "$(git branch --list sdk-release)" ]; then
  # Create the contract release branch
  git checkout -b sdk-release
else
    # Checkout the sdk release branch
    git checkout sdk-release
    # Merge the main branch
    git merge main
fi

# Push changes
git push origin sdk-release

# Checkout the main branch
git checkout main

# Exit with success
exit 0
