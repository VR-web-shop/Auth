
# Check if the contract release branch exists
if [ -z "$(git branch --list contract-release)" ]; then
  # Create the contract release branch
  git checkout -b contract-release
else
    # Checkout the contract release branch
    git checkout contract-release
fi

# Bumb version
npm version patch

# Commit changes
git add .
git commit -m "Bump version to $(npm version)"

# Push changes
git push origin contract-release

# Checkout the main branch
git checkout main

# Merge the contract release branch
git merge contract-release

# Push changes
git push origin main

# Exit with success
exit 0
