// ==============================
// PROBLEMS DATABASE
// ==============================

export const PROBLEMS = Object.freeze({
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",

    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      notes: [
        "Each input has exactly one solution.",
        "You may not use the same element twice.",
        "Return the answer in any order.",
      ],
    },

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 9",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],

    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
    ],

    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];

    if (map.has(diff)) {
      return [map.get(diff), i];
    }

    map.set(nums[i], i);
  }
}

// Test
console.log(twoSum([2,7,11,15],9));
`,

      python: `def twoSum(nums, target):
    hashmap = {}

    for i, num in enumerate(nums):
        diff = target - num
        if diff in hashmap:
            return [hashmap[diff], i]

        hashmap[num] = i

print(twoSum([2,7,11,15],9))
`,

      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap<>();

        for(int i=0;i<nums.length;i++){
            int diff = target - nums[i];

            if(map.containsKey(diff)){
                return new int[]{map.get(diff), i};
            }

            map.put(nums[i], i);
        }

        return new int[]{};
    }
}
`,
    },

    expectedOutput: {
      javascript: "[0,1]",
      python: "[0, 1]",
      java: "[0, 1]",
    },
  },

  // =========================================

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",

    description: {
      text: "Reverse a character array in-place.",
      notes: ["Use O(1) extra memory."],
    },

    examples: [
      {
        input: '["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
    ],

    constraints: ["1 ≤ s.length ≤ 10⁵"],

    starterCode: {
      javascript: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;

  while(left < right){
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}
`,
      python: `def reverseString(s):
    left, right = 0, len(s)-1

    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
`,
      java: `class Solution {
    public static void reverseString(char[] s) {

        int left = 0;
        int right = s.length-1;

        while(left < right){
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;

            left++;
            right--;
        }
    }
}
`,
    },

    expectedOutput: {
      javascript: '["o","l","l","e","h"]',
      python: "['o','l','l','e','h']",
      java: "[o, l, l, e, h]",
    },
  },
});

// ==============================
// LANGUAGE CONFIG
// ==============================

export const LANGUAGE_CONFIG = Object.freeze({
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
});

// ==============================
// HELPERS
// ==============================

export const PROBLEM_LIST = Object.values(PROBLEMS);

export const getProblemById = (id) => PROBLEMS[id];