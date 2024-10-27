import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

import APIKeyConfig from "./api-key-config";
import { defaultImageLoader } from "../lib/image-loaders";
import { ENABLE_LOCAL_API_KEY } from "../config/envs";

const Header: React.FC = () => {
  const t = useTranslations("ai");

  return (
    <div className="container mx-auto">
      <div className="items-center justify-between md:flex">
        <div className="py-10">
          <Link
            href="/"
            aria-current="page"
            className={`brand w-nav-brand w--current`}
            aria-label="home"
          >
            <h2 className="text-4xl font-bold text-white">{t("page.title")}</h2>
            <div className="flex items-center">
              <h3 className="mdL:text-xl mr-1 text-white">
                <i>{t("page.poweredBy")}</i>
              </h3>
              <div>
                <Image
                  src="/images/logo-only.png"
                  loading="lazy"
                  alt="Skyfire"
                  width="36"
                  height="24"
                  loader={defaultImageLoader}
                />
              </div>
            </div>
          </Link>
        </div>
        {ENABLE_LOCAL_API_KEY && <APIKeyConfig />}
      </div>
    </div>
  );
};

export default Header;
