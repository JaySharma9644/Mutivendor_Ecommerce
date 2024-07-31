import {allNav} from './allNav';

export const getNav =(role)=>{

    let FinalNav = allNav.filter(nav =>nav?.role?.trim()?.toLocaleLowerCase()===role.trim()?.toLocaleLowerCase());
    console.log(FinalNav);
    return FinalNav;


}