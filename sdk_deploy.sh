echo "Commiting any changes made before bumping the version"
git add .
git commit -m "Prepare deployment"

echo "Bumping the version"
npm version patch

echo "Pushing the changes to the main branch"
git add .
git commit -m "Bump version"
git push origin main

echo "Looking for the release branch"
if [ -z "$(git branch --list sdk-release)" ]; then
  echo "Creating the release branch locally"
  git checkout -b sdk-release
else
    echo "Checking out the release branch"
    git checkout sdk-release
    
    echo "Merging the main branch into the release branch"
    git merge main
fi

echo "Pushing the release branch to the remote"
git push origin sdk-release

echo "Checking out the main branch"
git checkout main

echo "Deployment completed successfully"
echo "Find the triggered workflow at: https://github.com/VR-web-shop/Auth/actions"
exit 0
