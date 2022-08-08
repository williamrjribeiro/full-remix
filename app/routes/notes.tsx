import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link as RemixLink, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTranslation } from "react-i18next";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import { Auth } from "aws-amplify";
import type { User } from "~/models/user.server";
import React from "react";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("[notes.loader]");
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

export const links: LinksFunction = () => ([{
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/icon?family=Material+Icons"
}])

// This tells remix to load the "notes" translation namespace/file
export let handle = {
  i18n: "notes",
};

const handleLogoutClick = async () => {
  // amplify sign out from browser
  await Auth.signOut();
  // session on server is handled by POST handler on logout.tsx
}

type Props = { notes: Awaited<ReturnType<typeof getNoteListItems>>, user: User, onLogoutClick: () => void; }


const NotesOG = ({ notes, user, onLogoutClick }: Props) => (
  <div className="flex h-full min-h-screen flex-col">
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <RemixLink to=".">Notes</RemixLink>
      </h1>
      <p>{user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          onClick={onLogoutClick}
        >
          Logout
        </button>
      </Form>
    </header>

    <main className="flex h-full bg-white">
      <div className="h-full w-80 border-r bg-gray-50">
        <RemixLink to="new" className="block p-4 text-xl text-blue-500">
          + New Note
        </RemixLink>

        <hr />

        {notes.length === 0 ? (
          <p className="p-4">No notes yet</p>
        ) : (
          <ol>
            {notes.map((note) => (
              <li key={note.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={note.id}
                >
                  📝 {note.title}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  </div>
)

const notesNS = { ns: 'notes' };

const Notes = ({ notes, user, onLogoutClick }: Props) => {
  const { t } = useTranslation(["common", "notes"]);
  return (
    <Container maxWidth="lg">
      <Box
        component="header"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <Icon>description</Icon>
        </Avatar>
        <Typography component="h1" variant="h2" mb={3}>
          <RemixLink to=".">
            {t('notes', notesNS)}
          </RemixLink>
        </Typography>
        <Grid container spacing={2} textAlign="center" alignItems="center" justifyContent="space-evenly">
          <Grid item xs={12} sm="auto">
            <Typography component="p">
              {`${t('by')} ${user.email}`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button variant="contained" size="small" component={RemixLink} to="new">{t('addNote', notesNS)}</Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              type="submit"
              size="small"
              color="secondary"
              onClick={onLogoutClick}
            >
              {t('logout')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box component="main">
        {notes.length === 0
          ? <Typography component="p">{t('noNotes', notesNS)}</Typography>
          : <ol>{notes.length}</ol>
        }
        <Outlet />
      </Box>
    </Container>
  )
}

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <Notes notes={data.noteListItems} user={user} onLogoutClick={handleLogoutClick} />
  );
}
