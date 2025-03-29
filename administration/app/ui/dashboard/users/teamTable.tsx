import React from "react";
import { TableBody, TableCell, TableRow } from "@/app/ui/table";
import { createClient } from "@/utils/supabase/server";
import TeamActions from "@/app/ui/dashboard/users/teamActions";

export default async function TeamTable() {
  const supabase = await createClient();

  //   const { toast } = useToast();
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  const { data: utilisateurs, error } = await supabase
    .from("profile")
    .select("*");

  if (error) throw error;

  const { data: admins, error: adminError } = await supabase
    .from("administration")
    .select("*");

  if (adminError) throw adminError;

  const { data: receptions, error: receptionError } = await supabase
    .from("reception")
    .select("*");

  if (receptionError) throw receptionError;

  const adminIds = admins?.map((admin) => admin.utilisateur_id) || [];
  const receptionIds =
    receptions?.map((reception) => reception.utilisateur_id) || [];

  const users = utilisateurs
    ?.filter(
      (user) => adminIds.includes(user.id) || receptionIds.includes(user.id)
    )
    .map((user) => ({
      ...user,
      role: adminIds.includes(user.id) ? "admin" : "reception",
    }));

  return (
    <TableBody>
      {users
        ?.filter((user) => user.email_verified)
        .map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.nom}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.telephone}</TableCell>
            <TableCell>
              {/* Role will be determined by queries */}
              {user.role} {currentUser?.id == user.id && "(vous)"}
            </TableCell>
            <TeamActions user={user} />
          </TableRow>
        ))}
    </TableBody>
  );
}
