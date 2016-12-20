##
## Connect Page to App
## ---
##
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"

##
## Change 'Persistent Menu' options
## ---
##
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Manage Subscription",
      "payload":"EDIT_SUBSCRIPTION"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=<PAGE_ACCESS_TOKEN>"

##
## Change 'Get Started' button
## ---
##
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
  "thread_state":"new_thread",
  "call_to_actions":[
    {
      "payload":"START"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=<PAGE_ACCESS_TOKEN>"
