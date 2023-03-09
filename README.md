# bangkok-open-source-discord

Scripts for managing the [**Bangkok Open Source Initiative** Discord server](https://discord.gg/cMQhdBUm8V) using the [Discord API](https://discord.com/developers/docs/reference), [Bun](https://bun.sh/), and [GitHub Actions](https://docs.github.com/en/actions).

## Messages

Edit these messages files, and the corresponding messages will be updated in the Discord server.

- [`./messages/resources.txt`](./messages/resources.txt) &rarr; [#resources channel](https://discord.com/channels/1062609208106832002/1062609209126039645/1070367687647166474)
- [`./messages/rules.txt`](./messages/rules.txt) &rarr; [#rules channel](https://discord.com/channels/1062609208106832002/1070380037435568233/1070380691969290372)

## Project channels

Project channels are listed in `projects.rb`. To preview changes, run:

```
ruby projects.rb && terraform plan -refresh=false
```

## Why

In Discord, only the creator of the message can edit it. By applying the principles of GitOps and put the message contents on Git and use GitHub Actions to update the messages on behalf of the server admin, anyone can contribute by submitting pull requests, making the process of maintaining and updating important information in Discord communities more efficient, collaborative, and transparent.

<img width="1032" alt="image" src="https://user-images.githubusercontent.com/193136/216098888-9441f09d-3735-459d-881e-3ed783cee16f.png">
