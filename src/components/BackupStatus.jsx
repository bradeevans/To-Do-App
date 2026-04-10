export default function BackupStatus({ isSupported, lastBackupTime, setFolder }) {
  if (!isSupported) return null

  const label = lastBackupTime
    ? `Last backup: ${lastBackupTime.toLocaleDateString()} ${lastBackupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Auto-backup: click to enable'

  return (
    <div className="backup-status" onClick={setFolder} title="Click to set or change backup folder">
      {label}
    </div>
  )
}
