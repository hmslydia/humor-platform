examples = [
    {
      joke_text: "Teacher: \"Kids,what does the chicken give you?\"<br> Student: \"Meat!\"<br> Teacher: \"Very good! Now what does the pig give you?\"<br> Student: \"Bacon!\"<br>Teacher: \"Great! And what does the fat cow give you?\"<br> Student: \"Homework!\"",
      analysis: [
        {
          tag: "Insult",
          answer: "Yes.",
          analysis: "The students are insulting the teacher",
          buttonType: "btn-primary"
        },
        {
          tag: "Word Play",
          answer: "Yes.",
          analysis: "'gives you' is used in two different ways",
          buttonType: "btn-primary"
        },
        {
          tag: "Expectation Violation",
          answer: "Yes.",
          analysis: "'Gives' is first used twice for animals 'providing meat,' we expect it to mean 'provide meat' again in the last example, but instead it is used to mean 'assign homework.'",
          buttonType: "btn-primary"
        },          
        {
          tag: "Connect the Dots",
          answer: "Yes.",
          analysis: "You have to realize that the 'fat cow' is the student's view of the teacher.",
          buttonType: "btn-primary"
        },
        {
          tag: "Observation",
          answer: "No.",
          analysis: "(Not that I can see)",
          buttonType: "btn-default"
        }
      ]
      
    },
    
    {
      joke_text: "A blonde, a redhead, and a brunette were all lost in the desert. They found a lamp and rubbed it. A genie popped out and granted them each one wish. The redhead wished to be back home. Poof! She was back home. The brunette wished to be at home with her family. Poof! She was back home with her family. The blonde said, \"Awwww, I wish my friends were here.\"",
      analysis: [
        {
          tag: "Insult",
          answer: "Yes.",
          analysis: "The blonde is dumb",
          buttonType: "btn-primary"
        },
        {
          tag: "Word Play",
          answer: "No.",
          analysis: "",
          buttonType: "btn-default"
        },
        {
          tag: "Expectation Violation",
          answer: "No.",
          analysis: "",
          buttonType: "btn-default"
        },          
        {
          tag: "Connect the Dots",
          answer: "Yes.",
          analysis: "By wishing that all her friends were here, the blonde has undone all her friends wishes.",
          buttonType: "btn-primary"
        },
        {
          tag: "Observation",
          answer: "No.",
          analysis: "",
          buttonType: "btn-default"
        }
      ]        
    },
    
    
    {
      joke_text: "The one thing that unites all human beings, regardless of age, gender, religion, economic status, or ethnic background, is that, deep down inside, we all believe that we are above-average drivers.",
      analysis: [
        {
          tag: "Insult",
          answer: "Yes.",
          analysis: "We are all not as smart as we think we are.",
          buttonType: "btn-primary"
        },
        {
          tag: "Word Play",
          answer: "No.",
          analysis: "",
          buttonType: "btn-default"
        },
        {
          tag: "Expectation Violation",
          answer: "Yes.",
          analysis: "By mentioning age, gender, religion, etc. you think he's going to mention a profound similarity, not a silly one.",
          buttonType: "btn-primary"
        },          
        {
          tag: "Connect the Dots",
          answer: "No.",
          analysis: "",
          buttonType: "btn-default"
        },
        {
          tag: "Observation",
          answer: "Yes.",
          analysis: "People have the tendency to over estimate thier abilities, especially driving.",
          buttonType: "btn-default"
        }
      ]        
    }    
  ]
