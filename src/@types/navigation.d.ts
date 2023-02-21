// import { Book as BookType } from '../models/books/book';

/* Interfaces for navigation routes */
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      /* Auth Routes */
      SignIn: undefined;
      Settings: undefined;
      /* App Routes */
      Home: undefined;
      Books: undefined;
      Book: { bookId: number; book?: any };
      Notifications: undefined;
      Notification: { notificationId: number };
    }
  }
}
