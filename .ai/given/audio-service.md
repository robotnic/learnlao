# Audio Service

playAudio('boeng_01')
playAudio('boeng_01', 'female')

* inject root
* the service should alternate 'male' 'female' (oeverall, not per word)
* it should work for phrases, alphabet, vocabulary

it should replace
*  togglePlay(word: VocabularyItem, gender: 'male' | 'female'): void {
*  togglePlayPhrase(phrase: PhraseItem, gender: 'male' | 'female'): void {


# todo
- Verify git credentials for deploy: Check that git credentials are set up and can push to gh-pages branch without prompts. Test with manual git push if needed.
- Build learnlao app for production: Run npm run build to generate the latest dist/apps/learnlao output for deployment.
- Deploy to gh-pages branch: Run npm run deploy-gh-pages to upload dist/apps/learnlao to the gh-pages branch using angular-cli-ghpages@1.0.7.
- Verify GitHub Pages update: Check the live site to confirm the latest version is deployed and visible on GitHub Pages.

