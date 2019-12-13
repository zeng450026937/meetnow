export function isSameDevice(a, b, withGroupId = false) {
  if (!a || !b) return false;

  const isSame = a.deviceId === b.deviceId
    && a.label === b.label
    && a.kind === b.kind;

  return withGroupId ? a.groupId === b.groupId && isSame : isSame;
}
