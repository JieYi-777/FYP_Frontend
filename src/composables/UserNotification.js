import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import axios1 from '../axios.service';
import moment from 'moment-timezone';

// Add visibility property for each notification
const addVisibilityProperty = (notifications) => {
  notifications.forEach(notification => {
    notification.visible = false;
  });

  return notifications;
}

// To sort and format the date_created attribute of each notification object
const sortAndFormatTime = (notifications) => {
  // Convert dates to ISO 8601 format for sorting
  notifications.forEach(notification => {
    const malaysiaTime = moment.utc(notification.date_created).tz('Asia/Kuala_Lumpur');
    notification.date_created_iso = malaysiaTime.format();
  });

  // Sort the array based on the ISO 8601 formatted date from latest to oldest
  notifications.sort((a, b) => {
    return moment(b.date_created_iso).diff(moment(a.date_created_iso));
  });

  // Format the sorted dates to 'DD MMM YYYY' format for display in Malaysia time
  notifications.forEach(notification => {
    const malaysiaTime = moment(notification.date_created_iso).tz('Asia/Kuala_Lumpur');
    notification.date_created_formatted = malaysiaTime.format('DD MMM YYYY');
  });

  return notifications;
}

// Return the notification and functions
export const getUserNotifications = () => {

  // Access the Vuex store object
  const store = useStore();

  // Access the toast object
  const toast = useToast();

  // Ref to the input (focusable)
  const toastFocus = ref(null);

  // The overlay panel component reference (Used for notification list)
  const opNotification = ref();

  // The notifications data
  const notifications = ref([]);

  // Send the request to get notification data
  const sendGetNotificationRequest = async() => {
    try {

      // Get the token
      const token = store.getters.getToken;
  
      // Fetch the user's notifications data
      const response = await axios1.get('/notifications', 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Extract notifications from the response, do some processing and return
      notifications.value =  addVisibilityProperty(sortAndFormatTime(response.data.notifications));
  
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toastFocus.value.focus();
      toast.add({ severity: 'error', summary: 'Notification Error', 
        detail: 'Unable to retrieve notifications. Please refresh. If the issue persists, seek support.', life: 4000 });
    }
  }  
  
  // Toggle the event for the component
  const toggleNotification = (event) => {
    opNotification.value.toggle(event);
  }

  // To compute the number of unread notifications
  const num_unreadNotifications = computed( () => {
    return notifications.value.filter(notification => !notification.has_read).length;
  })

  // To compute any Dialog component is opened (it show the complete notification)
  const isDialogOpen = computed(() => {
    return notifications.value.some(notification => notification.visible);
  });

  // To mark single notification read to true (mark as has read)
  const markAsRead = (notification_id) => {
    // Get the notification in array
    const notification = notifications.value.find(item => item.id === notification_id);

    if(!notification.has_read){
      notification.has_read = true;

      // Get the token
      const token = store.getters.getToken;

      // Send the PUT request to mark a notification as has read
      axios1.put(`notifications/mark-as-read/${notification_id}`,{}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(error => {
        console.error('Error marking notification as read:',error);
        toastFocus.value.focus();
        toast.add({ severity: 'error', summary: 'Mark as Read Error', 
          detail: 'Unable to mark the notification as read. Please try again later.', life: 3000 });
      })
    }
  }

  // To mark all notifications read to true (mark as has read)
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.has_read = true;
    });

    // Get the token
    const token = store.getters.getToken;

    // Send the PUT request to mark all notifications as has read
    axios1.put(`notifications/mark-all-as-read`,{}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(error => {
      console.error('Error marking all notifications as read:',error);
      toastFocus.value.focus();
      toast.add({ severity: 'error', summary: 'Mark All as Read Error', 
        detail: 'Unable to mark all notifications as read. Please try again later.', life: 3000 });
    })
  }

  return { toastFocus, opNotification, notifications, sendGetNotificationRequest, toggleNotification, num_unreadNotifications, isDialogOpen, markAsRead, markAllAsRead };
}


// Function to truncate the text string to specific characters length, default is 50 characters (can be set)
export const truncate = (text, maxLength=50) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
}
