---
title: 'Git Bisect, the best bug hunter'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro. sas'
pubDate: 'Apr 24 2024'
heroImage: '/blog-placeholder-4.jpg'
---

Let's discuss how to solve a common problem when working in teams. Suddenly, you realize that one of the functionalities doesn't work.

Let's say we have several commits since the last working one. We can check them one by one, but it's very inefficient. It would be nice if we only had four commits since the last working one. But what if we have a hundred of them?

Fortunately, Git comes with a core solution for this situation.
## Git Bisect
  
That's the built-in tool in Git for finding specific commits. Thanks to binary search, which has a Big O complexity of O(log n), we can quickly locate the problematic commit.

If we have 100 commits to search through one by one, the worst-case scenario is finding the issue after 100 attempts. However, with binary search, our worst-case scenario is reduced to just 7 tries.

## How to use it

```
//It starts bisect mode
git bisect start

//point commit without error
git bisect good (commit id)

//point commit with error
git bisect bad (commit id)
```

### Example
For the tutorial i created 10 commits. v1, v2, v3...
```
eabef10 (HEAD -> master) HEAD@{11}: commit: v10
8b93730 HEAD@{12}: commit: v9
e4d1d45 HEAD@{13}: commit: v8 
11a2851 HEAD@{14}: commit: v7 
6462218 HEAD@{15}: commit: v6 error
d18ea35 HEAD@{16}: commit: v5
e528cc0 HEAD@{17}: commit: v4
b2b4e49 HEAD@{18}: commit: v3
ede6fc2 HEAD@{19}: commit: v2
f4e8b47 HEAD@{20}: commit (initial): v1
```
and v6 contains error (we don't know about it). 

Lets find error! 
```
C:\playground\git_bisect>git bisect start
status: waiting for both good and bad commits

C:\playground\git_bisect>git bisect bad
status: waiting for good commit(s), bad commit known

C:\playground\git_bisect>git bisect good f4e8b47
Bisecting: 4 revisions left to test after this (roughly 2 steps)
[d18ea35ca539412ae5af35a8967f8ac268698b3d] v5
```

Currently, we're in the middle between the bad commit (v10) and the good commit (v1). Bisect has divided this range in half and is now awaiting our input.
Is it good or bad? 

```
C:\workspace\playground\git_bisect>git bisect good
Bisecting: 2 revisions left to test after this (roughly 1 step)
[11a2851bcd3410b35aa70f4316f73367742cdd48] v7
```
``
We've indicated that the current commit is good. Consequently, Bisect has further divided the range in half, bringing us to commit v7. 
Is it good or bad? 

```
C:\workspace\playground\git_bisect>git bisect bad
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[6462218717214bdc992954c20e2bbd888d61383c] v6
```
  
We've marked the current commit as bad. Bisect has responded by halving the range again and checking out to commit v6, as it sits in the middle between the good commit v5 and the bad commit v7.

```
C:\workspace\playground\git_bisect>git bisect bad
6462218717214bdc992954c20e2bbd888d61383c is the first bad commit
commit 6462218717214bdc992954c20e2bbd888d61383c
Author: jadj <jakub.jadczyk@innsoft.pl>
Date:   Mon Apr 22 08:55:30 2024 +0200

    v6

 index.html | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```
We type bad and there are no more options left and we've indicated that the current commit is bad.

Here is simple diagram that might help to understand what happened. 

## Diagram
![Bisect diagram](/blog/git-bisect-diagram.png)
<!-- ![[bisectDiagram.canvas|bisectDiagram]] -->
  
We keep selecting whether each commit is good or bad, and eventually, we'll find what we're looking for.

Now that we've identified which commit is causing trouble, we can continue our work. It's a very powerful built-in tool. We don't need to install anything extra, and we can leverage the full power of Git. Enjoy!








