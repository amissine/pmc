export function config (command) {

  const commands = {
    'arbitrage': function (feed) {
      feed(null)
    },
  }

  return commands[command]
}
