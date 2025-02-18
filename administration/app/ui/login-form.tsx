"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm({ mode }: { readonly mode: string }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const email = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    try {
      // type-casting here for convenience
      // in practice, you should validate your inputs
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const parsedCredentials = z
        .object({
          email: z.string().email({ message: "please enter a valid email" }),
          password: z
            .string()
            .min(6, { message: "please a password greath that or equal 6" }),
        })
        .safeParse(data);

      if (parsedCredentials.success) {
        const { error } = await supabase.auth.signInWithPassword(data);

        if (error) return setError(error.message);

        router.push("/dashboard");
      } else {
        setError(parsedCredentials.error.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    try {
      // type-casting here for convenience
      // in practice, you should validate your inputs
      const formData = new FormData(e.currentTarget);
      const data = {
        password: formData.get("password") as string,
        phone: formData.get("phone") as string,
        user_metadata: {
          name: formData.get("name") as string,
        },
      };

      const parsedCredentials = z
        .object({
          password: z
            .string()
            .min(6, { message: "please a password greath that or equal 6" }),
          phone: z
            .string()
            .min(13, { message: "please enter 13 number" })
            .max(13, { message: "please enter 13 number" }),
        })
        .safeParse(data);

      if (parsedCredentials.success) {
        const { data: {user}, error: errorUpdate } = await supabase.auth.admin.updateUserById(
          String(id),
          data
        );

        if (errorUpdate) return setError(errorUpdate.message);

        const { error: errorSetting } = await supabase.from('parametres_du_site').insert({utilisateur_id: user?.id});

        if (errorSetting) throw errorSetting;

        router.push("/dashboard");
      } else {
        setError(parsedCredentials.error.message);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return mode == "login" ? (
    <form onSubmit={login} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Veuillez vous connecter pour continuer.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Entrez votre adresse email"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Entrez le mot de passe"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full" disabled={loading} type="submit">
          Se connecter{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </>
          )}
        </div>
      </div>
    </form>
  ) : (
    <form onSubmit={signup} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Veuillez vous connecter pour continuer.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Nom
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Entrez votre nom"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Entrez votre adresse email"
                defaultValue={email!}
                disabled
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Entrez le mot de passe"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="phone"
            >
              Telephone
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="phone"
                type="text"
                name="phone"
                defaultValue="+212"
                placeholder="Entrez votre telephone"
                required
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full" disabled={loading} type="submit">
          Se connecter{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex items-end space-x-1">
          {/* Add form errors here */}
          {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
