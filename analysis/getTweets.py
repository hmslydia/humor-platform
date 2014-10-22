from twitter import *
import os
import json

MY_TWITTER_CREDS = os.path.expanduser('~/.my_app_credentials')

CONSUMER_KEY = 'YNxaeRqrYacqIQAyucVzOPSSP'
CONSUMER_SECRET = 'Po1FJNYsy0gPsh009LnLiUsDtnAg5I7OLhzvXXDk3SyO5JuBW7'
if not os.path.exists(MY_TWITTER_CREDS):
    oauth_dance("Humor Platform", CONSUMER_KEY, CONSUMER_SECRET,
                MY_TWITTER_CREDS)

oauth_token, oauth_secret = read_token_file(MY_TWITTER_CREDS)

twitter = Twitter(auth=OAuth(
    oauth_token, oauth_secret, CONSUMER_KEY, CONSUMER_SECRET))
    
#https://twitter.com/best_jokes    
x = twitter.statuses.user_timeline(screen_name="best_jokes", count=100)

# The first 'tweet' in the timeline

jokes_out = open('jokes2.py', 'w')
#jokes_out.write('jokes2 = ')
jokes_out.write(json.dumps(x))

