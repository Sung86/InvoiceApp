import '@/assets/styles/quasar.scss';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import { Notify, Dialog, Loading } from 'quasar';

// To be used on app.use(Quasar, { ... })
export default {
	plugins: [Notify, Dialog, Loading],
	config: {},
};
