import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faBars,
  faAnglesLeft,
  faGear,
  faUsers,
  faChalkboardUser,
  faBook,
  faClock
} from "@fortawesome/free-solid-svg-icons"

export default function setupFontAwesomeIcons() {
    library.add(
        faUser,
        faBars,
        faAnglesLeft,
        faGear,
        faUsers,
        faChalkboardUser,
        faBook,
        faClock
    );
}