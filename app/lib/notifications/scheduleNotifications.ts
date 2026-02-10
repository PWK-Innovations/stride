interface ScheduledBlock {
  task_id: string;
  start_time: string;
  end_time: string;
  title: string;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleNotifications(blocks: ScheduledBlock[]) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();

  blocks.forEach((block) => {
    const startTime = new Date(block.start_time);
    const timeUntilStart = startTime.getTime() - now.getTime();

    // Only schedule if start time is in the future
    if (timeUntilStart > 0) {
      setTimeout(() => {
        new Notification('Time to: ' + block.title, {
          body: `Scheduled from ${startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: block.task_id,
        });
      }, timeUntilStart);
    }
  });
}
