export function isDeletionConfirmed(
  typedEmail: string,
  accountEmail: string,
): boolean {
  return (
    accountEmail !== '' &&
    typedEmail.trim().toLowerCase() === accountEmail.toLowerCase()
  )
}
