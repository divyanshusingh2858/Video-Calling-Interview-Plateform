// ==============================
// PROBLEMS DATABASE - 10 TOTAL QUESTIONS
// ==============================

export const PROBLEMS = Object.freeze({
  // EXISTING QUESTIONS (2)
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

  // ========== NEW QUESTION 1 ==========
  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String • Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: [
        "Open brackets must be closed by the same type of brackets.",
        "Open brackets must be closed in the correct order.",
        "Every close bracket has a corresponding open bracket of the same type.",
      ],
    },
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const pairs = {
    '(': ')',
    '[': ']',
    '{': '}'
  };

  for (let char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }

  return stack.length === 0;
}

console.log(isValid("()"));
`,
      python: `def isValid(s):
    stack = []
    pairs = { '(': ')', '[': ']', '{': '}' }

    for char in s:
        if char in pairs:
            stack.append(char)
        else:
            if not stack or pairs[stack.pop()] != char:
                return False

    return len(stack) == 0

print(isValid("()"))
`,
      java: `import java.util.*;

class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put('(', ')');
        pairs.put('[', ']');
        pairs.put('{', '}');

        for (char c : s.toCharArray()) {
            if (pairs.containsKey(c)) {
                stack.push(c);
            } else {
                if (stack.isEmpty() || pairs.get(stack.pop()) != c) {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }
}
`,
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
    },
  },

  // ========== NEW QUESTION 2 ==========
  "palindrome-number": {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an integer x, return true if x is a palindrome, and false otherwise.",
      notes: ["A palindrome reads the same forwards and backwards."],
    },
    examples: [
      {
        input: "x = 121",
        output: "true",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "Reads as 121- from left to right",
      },
    ],
    constraints: ["-2³¹ ≤ x ≤ 2³¹ - 1"],
    starterCode: {
      javascript: `function isPalindrome(x) {
  if (x < 0) return false;

  let reversed = 0;
  let original = x;

  while (x > 0) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }

  return original === reversed;
}

console.log(isPalindrome(121));
`,
      python: `def isPalindrome(x):
    if x < 0:
        return False

    original = x
    reversed_num = 0

    while x > 0:
        reversed_num = reversed_num * 10 + (x % 10)
        x //= 10

    return original == reversed_num

print(isPalindrome(121))
`,
      java: `class Solution {
    public static boolean isPalindrome(int x) {
        if (x < 0) return false;

        int original = x;
        int reversed = 0;

        while (x > 0) {
            reversed = reversed * 10 + (x % 10);
            x /= 10;
        }

        return original == reversed;
    }
}
`,
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
    },
  },

  // ========== NEW QUESTION 3 ==========
  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Find the contiguous subarray with the largest sum and return its sum.",
      notes: ["Kadane's Algorithm approach"],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has largest sum = 6",
      },
      {
        input: "nums = [1]",
        output: "1",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));
`,
      python: `def maxSubArray(nums):
    max_sum = current_sum = nums[0]

    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum

print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))
`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }
}
`,
    },
    expectedOutput: {
      javascript: "6",
      python: "6",
      java: "6",
    },
  },

  // ========== NEW QUESTION 4 ==========
  "merge-sorted-arrays": {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Arrays",
    difficulty: "Easy",
    category: "Array • Two Pointers",
    description: {
      text: "Merge two sorted arrays into one sorted array.",
      notes: ["The result should be sorted in ascending order."],
    },
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
      },
    ],
    constraints: ["nums1.length == m + n", "0 ≤ m,n ≤ 200"],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }

  return nums1;
}

console.log(merge([1,2,3,0,0,0], 3, [2,5,6], 3));
`,
      python: `def merge(nums1, m, nums2, n):
    i = m - 1
    j = n - 1
    k = m + n - 1

    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1

    return nums1

print(merge([1,2,3,0,0,0], 3, [2,5,6], 3))
`,
      java: `import java.util.Arrays;

class Solution {
    public static int[] merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        int k = m + n - 1;

        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[k--] = nums1[i--];
            } else {
                nums1[k--] = nums2[j--];
            }
        }

        return nums1;
    }
}
`,
    },
    expectedOutput: {
      javascript: "[1,2,2,3,5,6]",
      python: "[1,2,2,3,5,6]",
      java: "[1,2,2,3,5,6]",
    },
  },

  // ========== NEW QUESTION 5 ==========
  "linked-list-cycle": {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List • Two Pointers",
    description: {
      text: "Given head of a linked list, determine if it has a cycle.",
      notes: ["Use Floyd's Cycle Detection (Tortoise and Hare)"],
    },
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "Cycle at node with value 2",
      },
    ],
    constraints: ["0 ≤ nodes ≤ 10⁴"],
    starterCode: {
      javascript: `function hasCycle(head) {
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}
`,
      python: `def hasCycle(head):
    if not head or not head.next:
        return False

    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            return True

    return False
`,
      java: `public class Solution {
    public static boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;

        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) return true;
        }

        return false;
    }
}
`,
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
    },
  },

  // ========== NEW QUESTION 6 ==========
  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Array • Binary Search",
    description: {
      text: "Given a sorted array and target, return index of target if found, else -1.",
      notes: ["Must be O(log n) runtime complexity."],
    },
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "nums is sorted in ascending order"],
    starterCode: {
      javascript: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

console.log(search([-1,0,3,5,9,12], 9));
`,
      python: `def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

print(search([-1,0,3,5,9,12], 9))
`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }

        return -1;
    }
}
`,
    },
    expectedOutput: {
      javascript: "4",
      python: "4",
      java: "4",
    },
  },

  // ========== NEW QUESTION 7 ==========
  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      notes: ["This is essentially Fibonacci sequence"],
    },
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "1+1 or 2",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "1+1+1, 1+2, 2+1",
      },
    ],
    constraints: ["1 ≤ n ≤ 45"],
    starterCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;

  let prev1 = 1;
  let prev2 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev1 = prev2;
    prev2 = current;
  }

  return prev2;
}

console.log(climbStairs(5));
`,
      python: `def climbStairs(n):
    if n <= 2:
        return n

    prev1, prev2 = 1, 2

    for i in range(3, n + 1):
        current = prev1 + prev2
        prev1, prev2 = prev2, current

    return prev2

print(climbStairs(5))
`,
      java: `class Solution {
    public static int climbStairs(int n) {
        if (n <= 2) return n;

        int prev1 = 1;
        int prev2 = 2;

        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev1 = prev2;
            prev2 = current;
        }

        return prev2;
    }
}
`,
    },
    expectedOutput: {
      javascript: "8",
      python: "8",
      java: "8",
    },
  },

  // ========== NEW QUESTION 8 ==========
  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array • Hash Set",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice, false if every element is distinct.",
      notes: ["Use HashSet for O(n) solution"],
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  const seen = new Set();

  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }

  return false;
}

console.log(containsDuplicate([1,2,3,1]));
`,
      python: `def containsDuplicate(nums):
    seen = set()

    for num in nums:
        if num in seen:
            return True
        seen.add(num)

    return False

print(containsDuplicate([1,2,3,1]))
`,
      java: `import java.util.*;

class Solution {
    public static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            if (seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }

        return false;
    }
}
`,
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
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