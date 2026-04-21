export const PROBLEMS = {
  twoSum: {
    title: "Two Sum",
    category: "Array",

    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      notes: ["You may assume that each input would have exactly one solution."]
    },

    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
}`
    },

    // ✅ RUN BUTTON (visible test cases)
    testCases: [
      {
        input: "[2,7,11,15], 9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4], 6",
        output: "[1,2]"
      }
    ],

    // 🔥 SUBMIT BUTTON (hidden test cases)
    hiddenTestCases: [
      {
        input: "[1,5,3,7], 8",
        output: "[0,3]"
      },
      {
        input: "[10,20,30], 50",
        output: "[1,2]"
      }
    ]
  },

  palindrome: {
    title: "Palindrome Check",
    category: "String",

    description: {
      text: "Check if a given string is a palindrome.",
      notes: []
    },

    starterCode: {
      javascript: `function isPalindrome(str) {
  // Write your code here
}`
    },

    testCases: [
      {
        input: `"madam"`,
        output: "true"
      },
      {
        input: `"hello"`,
        output: "false"
      }
    ],

    hiddenTestCases: [
      {
        input: `"racecar"`,
        output: "true"
      },
      {
        input: `"world"`,
        output: "false"
      }
    ]
  }
};
export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "...",
    monacoLang: "javascript"
  }
};