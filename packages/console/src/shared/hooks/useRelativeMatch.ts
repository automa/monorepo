import {
  RelativeRoutingType,
  To,
  useMatch,
  useResolvedPath,
} from 'react-router-dom';

const useRelativeMatch = (
  to: To,
  end: boolean = true,
  relative?: RelativeRoutingType,
) => {
  const resolvedPath = useResolvedPath(to, { relative });

  return useMatch({ path: resolvedPath.pathname, end });
};

export default useRelativeMatch;
