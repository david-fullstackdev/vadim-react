#Code Review

- Submit Code Review per specific small features to facilitate the Code Review process. Do not accumulate many features, or mix bugfix session with feature development - it will delay bugs verification.
- Create or rename branch for each feature or a fix with names like the following: feature/<MyFeature> or fix/<MyFix>. Do not use the same branch for several Code Review (Inspection) sessions.
- Create feature branches from the master branch, do not make dev branches from other’s developers branches.
- Before initiating a Code-Review process for a given branch/feature need to perform an "up-merge", i.e. merge the latest master branch into the "feature" branch in order to properly resolve all the merge conflicts.
- For Future Consideration: Use GitHub recommended master/develop cycle as described here: http://nvie.com/posts/a-successful-git-branching-model/
