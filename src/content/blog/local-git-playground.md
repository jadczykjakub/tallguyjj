---
title: 'Local git playground'
description: 'How to create Git repo localy for learning purposes'
pubDate: 'Jun 11 2024'
heroImage: '/blog-placeholder-4.jpg'
---

Knowing Git is a crucial development skill nowadays, so experimenting with different scenarios in a playground is a good idea.

Because of that, I will show you how to create a Git playground locally so we can work on our Git skills without pushing trash repositories to our GitHub

### File structure 

```
📦git-playground
 ┣ 📂fake-repo  
 ┣ 📂computer1  
 ┗ 📂computer2   
```

### Initialize git

fake-repo
```bash
git init --bare
```
with --bare we create git repository we can pull, push, fetch or clone from it but it doesn't contain files in directory itself.

computer1
```bash
git init
git remote add origin ../fake-repo
```

computer2
```bash
git init
git remote add origin ../fake-repo
```

On computer1 and computer2, we initialize the repository and connect to the origin from the 'fake-repo' directory. We can connect as many repositories as we want to our fake-repo. 

![fake repo diagram1](/blog/local-git-playground/1.png)

It very simple and fast way to create git repo for testing purposes. 

### Check if it works

from /git-playground/computer1
```bash
	## Create file.txt with "hello world" string
	echo "hello world" > file.txt
	## Add to staging
	git add file.txt
	## Commit file
	git commit -m "add file.txt"
	## Push changes to fake-repo
	git push -u origin master
```

from /git-playground/computer2

```bash
	## Pull changes
	git pull origin master
```

Right now, you should see changes from computer2 on computer1 because both are connected to the same origin, which is fake-repo.

Okay, I showed how to set up the connection and verify that it works. Let's see how we can train with Git locally.

### Merge conflict
Merge conflicts are a nightmare until you learn how to dance with them. 😄 And the best way to learn any skill is through practice, so let's practice!

from /git-playground/computer1
```bash
	## Create file.txt with "hello world" string
	echo "hello world from computer1" > file.txt
	## Add to staging
	git add file.txt
	## Commit file
	git commit -m "add file.txt"
	## Push changes to fake-repo
	git push
```


from /git-playground/computer2
```bash
	## Create file.txt with "hello world" string
	echo "hello world from computer2" > file.txt
	## Add to staging
	git add file.txt
	## Commit file
	git commit -m "add file.txt"
	## Push changes to fake-repo
	git push -u origin master
```

And... we got rejected. It says that we can't push because there are changes in the master branch that our repository doesn't include. So, we need to pull.

```bash
	git pull origin master
```

And... we have a merge conflict. 
We need to solve the problem. It's up to us how we're going to handle it. It's a perfect situation to train with different approaches.

### Conclusion
Creating a local fake repository is the perfect playground when we're learning Git or want to see what might happen when we're about to perform certain operations in a real-world repository.
