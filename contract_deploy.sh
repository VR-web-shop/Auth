git add .
git commit -m "Prepare deployment"

# Bumb version
npm run version patch

# Commit changes
git add .
git commit -m "Bump version"

# Push changes
git push origin main

# Check if the contract release branch exists
if [ -z "$(git branch --list contract-release)" ]; then
  # Create the contract release branch
  git checkout -b contract-release
else
    # Checkout the contract release branch
    git checkout contract-release
    # Merge the main branch
    git merge main
fi

# Push changes
git push origin contract-release

# Checkout the main branch
git checkout main

# Exit with success
exit 0
