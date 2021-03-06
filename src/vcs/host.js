export default function (hosts, options) {
  const lowercasedHosts = Object.fromEntries(
    Object.entries(hosts).map(([name, details]) => [name.toLowerCase(), details])
  );
  const {host: chosenHost, ...rest} = options;
  const host = lowercasedHosts[chosenHost];

  if (host) return host.scaffolder(rest);

  return {};
}
