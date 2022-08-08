import Link from "@mui/material/Link";
import { Link as RemixLink } from "@remix-run/react";
import { withTranslation } from 'react-i18next';

export let handle = {
  i18n: "notes",
};

const NoteIndexPage = withTranslation("notes")(({ t }) => (
  <p>
    {t('noSelection')}
    <Link component={RemixLink} to="new">
      {t('noSelection2')}
    </Link>
  </p>
))

export default NoteIndexPage
