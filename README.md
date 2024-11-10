# athena
For my fellow students who struggle with finding online practice for their upcoming quizzes or tests, here's Athena!
It's a quick little project that I made in a week or so for High Seas :3

If you're running this on VSCode or any other software for whatever reason, just make sure to set up the virtualenv + download the necessary packages (Flask (pip install flask) and gemini api (pip install -q -U google-generativeai)). Replace the apikey variable with your own api key (you can get one for free, just check out geminiapi instructions)

Or better yet, just check out https://sharma39avishi.pythonanywhere.com/ to actually use the project.

Make an account-- all you need is a username and password. When you're redirected to the main page, just click the button with the plus (+) to create a "practice set". 

As of now, Athena only works with digital notes. (training an AI model to pull text from handwriting is indubitably a hard feat!!) Copy and paste your notes into the respective box. Give your set a title, image (find the image you want to use online and copy its image address-- try to find one as close to square resolution as possible, as it will otherwise stretch/shrink your image to fit), and short description (all three of these fields are required). And finally, type in the number of questions you'd like on your practice test, with a minimum of 10 and a maximum of 50-- Athena will not let you choose a number higher or lower than the threshold. 

Just wait a few seconds. The page will seemingly freeze, but it's simply the data being sent to and fro the backend.

YOu'll be redirected to the main page, where your new practice set will appear. You may make as many practice sets as you'd like.

Click on a practice set to practice-test yourself. You'll be given two buttons, a test button and a delete button. The delete button will permanently delete your practice set (you will not get it back), so be wary if/when using it. 

The practice test functions like any normal practice test. Simply select the response you believe to be correct and click the 'check' button. If your answer is correct, it will display so. If not, after a delay of one or two seconds, a brief ai-generated explanation of why your answer was incorrect, as well as the correct answer, will appear. Click the next button to advance. Once you have finished all the questions, you will receive your score.

Aaaand that's really it! Athena will autosave all practice sets, so there's no need to go searching for a save button. Happy studying!
