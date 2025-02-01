import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/table";
import { createClient } from "@/utils/supabase/server";
import TeamActions from "@/app/ui/dashboard/users/teamActions";
import { auth } from "@/auth";

export default async function TeamTable() {
  const supabase = await createClient();
  const currentAuth = await auth()
  
  //   const { toast } = useToast();

  const { data: utilisateurs, error } = await supabase
    .from("utilisateur")
    .select("*");

  if (error) throw error;

  const { data: admins, error: adminError } = await supabase
    .from("administration")
    .select("*");

  if (adminError) throw adminError;

  const { data: securities, error: securiteError } = await supabase
    .from("securite")
    .select("*");

  if (securiteError) throw securiteError;

  const adminIds = admins?.map((admin) => admin.utilisateur_id) || [];
  const securityIds =
    securities?.map((security) => security.utilisateur_id) || [];

  const users = utilisateurs?.filter(
    (user) => adminIds.includes(user.id) || securityIds.includes(user.id)
  ).map(user => ({
    ...user,
    password: adminIds.includes(user.id) ? admins?.find(admin => admin.utilisateur_id === user.id)?.password : securities?.find(security => security.utilisateur_id === user.id)?.password,
    role: adminIds.includes(user.id) ? "admin" : "security"
  }));

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.nom}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>0{user.telephone}</TableCell>
              <TableCell>
                {/* Role will be determined by queries */}
                {adminIds.includes(user.id) ? "Admin" : "Security"} {currentAuth?.user?.email == user.email && '(vous)'}
              </TableCell>
              <TeamActions user={user} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
