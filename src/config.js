export function config (command) {

  const commands = {
    'arbitrage': function (feed) {
      feed()
    },
  }

  return commands[command]
}
