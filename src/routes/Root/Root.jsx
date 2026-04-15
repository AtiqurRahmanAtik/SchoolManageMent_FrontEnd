
import { Outlet, useLocation,  } from "react-router-dom";

import Footer from '../../components/Footer';
import NavigationBar from "../../components/NavigationBar/NavigationBar";




const Root = () => {


    const location = useLocation().pathname === "/login" && useLocation.pathname ==="/register";

    console.log("location ", location);

    
  


    return (
        <div>

         
        <header>
       { location &&   <NavigationBar />}
          {/* <NavHome/> */}
          
        </header>
      
        
        {/* Dynamic section */}
        <main className=''>
            <Outlet />
        </main>


        <footer>
           {location && <Footer/>}
        </footer>

      
    </div>
    );
};

export default Root;