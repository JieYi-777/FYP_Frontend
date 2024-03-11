import { ref, computed } from 'vue';

export const getUserNotifications = () => {

  // The overlay panel component reference (Used for notification list)
  const opNotification = ref();

  const notifications = ref([
    { id: 1, title: 'Welcome to Smart Finance!', message: "Welcome to Smart Finance! We're thrilled to have you join our community. Here, you can easily manage your expenses, track your budgets, and stay informed about your financial goals.\n\nTo get started, we recommend setting up your budgets for different categories like food, transportation, and housing. By doing so, you'll receive timely notifications when you're approaching your budget limits.\n\nFeel free to explore the platform and reach out if you have any questions. Happy budgeting!", 
    date_created: '3 Nov 2024', read: false, visible: false },
    { id: 2, title: 'Bernardo Dominic', message: 'bernardodominic.png', date_created: '16 May 2024', read: false, visible: false },
    { id: 3, title: 'Ioni Bowcher', message: 'ionibowcher.png', date_created: '28 Jun 2024', read: false, visible: false }
  ]);

  // Toggle the event for the component
  const toggleNotification = (event) => {
    opNotification.value.toggle(event);
  }

  // To compute the number of unread notifications
  const num_unreadNotifications = computed( () => {
    return notifications.value.filter(notification => !notification.read).length;
  })

  // To compute any Dialog component is opened (it show the complete notification)
  const isDialogOpen = computed(() => {
    return notifications.value.some(notification => notification.visible);
  });

  // To mark single notification read to true (mark as read)
  const markAsRead = (notification_id) => {
    const notification = notifications.value.find(item => item.id === notification_id);
    if(!notification.read){
      notification.read = true;
    }
  }

  // To mark single notification read to true (mark as read)
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      if(!notification.read){
        notification.read = true;
      }
    });
  }

  return { opNotification, notifications, toggleNotification, num_unreadNotifications, isDialogOpen, markAsRead, markAllAsRead };
}


// Function to truncate the text string to specific characters length, default is 50 characters (can be set)
export const truncate = (text, maxLength=50) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
}
