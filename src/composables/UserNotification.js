import { ref, computed } from 'vue';

export const getUserNotifications = () => {
  const op = ref();

  const notifications = ref([
    { id: 1, title: 'Welcome to Smart Finance!', message: "Welcome to Smart Finance! We're thrilled to have you join our community. Here, you can easily manage your expenses, track your budgets, and stay informed about your financial goals.\n\nTo get started, we recommend setting up your budgets for different categories like food, transportation, and housing. By doing so, you'll receive timely notifications when you're approaching your budget limits.\n\nFeel free to explore the platform and reach out if you have any questions. Happy budgeting!", 
    date_created: 'amy@email.com', read: true },
    { id: 2, title: 'Bernardo Dominic', message: 'bernardodominic.png', date_created: 'bernardo@email.com', read: true },
    { id: 3, title: 'Ioni Bowcher', message: 'ionibowcher.png', date_created: 'ioni@email.com', read: false }
  ]);

  const toggleNotification = (event) => {
    op.value.toggle(event);
  }

  const num_unreadNotifications = computed( () => {
    return notifications.value.filter(notification => !notification.read).length;
  })

  return { op, notifications, toggleNotification, num_unreadNotifications };
}
