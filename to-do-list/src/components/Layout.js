import Sidebar from './Sidebar/Sidebar';
import styles from './layout.module.css';

export default function Layout({ children }) {
    return (
      <div>
        <div className={styles.sideBar}>
          <Sidebar />
        </div>
        
        <main className={styles.main}>
          {children}
        </main>      
      </div>
    )
  }