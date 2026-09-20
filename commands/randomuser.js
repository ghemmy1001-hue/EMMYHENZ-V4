module.exports = {
  name: 'randomuser',
  description: 'Generate a random user profile',
  async execute(sock, sender) {
    try {
      const response =
        await fetch('https://randomuser.me/api/');

      const data = await response.json();
      const user = data.results?.[0];

      if (!user) throw new Error('No user returned.');

      await sock.sendMessage(sender, {
        text:
`👤 *RANDOM USER*

Name: ${user.name.first} ${user.name.last}
Gender: ${user.gender}
Country: ${user.location.country}
City: ${user.location.city}
Email: ${user.email}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Random user failed.\n${error.message}`
      });
    }
  }
};
