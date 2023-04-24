import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";
import axios from "axios";
import React, { FC } from "react";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

type Props = {
  movieId: string;
};

const FavoriteButton: FC<Props> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = () => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(movieId);
  };

  const toggleFavorites = async () => {
    let res;

    if (isFavorite()) {
      res = await axios.post("/api/favorite", {
        movieId,
        currentUser: currentUser,
        type: "DELETE",
      });
    } else {
      res = await axios.post("/api/favorite", {
        movieId,
        currentUser: currentUser,
        type: "POST",
      });
    }

    const updatedFavoriteIds = res?.data?.favouriteIds;

    mutate({
      ...currentUser,
      favouriteIds: updatedFavoriteIds,
    });

    mutateFavorites();
  };

  const Icon = isFavorite() ? AiOutlineCheck : AiOutlinePlus;

  return (
    <div
      onClick={toggleFavorites}
      className="
        cursor-pointer 
        group/item 
        w-6 
        h-6 
        lg:w-10 
        lg:h-10 
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
        "
    >
      <Icon className="text-white" size={25} />
    </div>
  );
};

export default FavoriteButton;
