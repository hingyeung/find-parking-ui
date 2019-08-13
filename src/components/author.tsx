import * as React from 'react';
import styled from 'styled-components';
import githubIcon from '../assets/github.svg'
import emailIcon from '../assets/mail.svg'

const AuthorSC = styled.div`
  text-align: center;
  font-size: small;
`;

const SocialIcon = styled.img`
  width: 18px;
  height: 18px;
  vertical-align: text-bottom;
`;

const IconLink: React.FunctionComponent<{iconSrc: string;} & React.HTMLProps<HTMLAnchorElement & HTMLImageElement>> = (props) => {
  const {className, href, alt, target} = props;
  return (
    <a {...{className, href, target}}>
      <SocialIcon alt={alt} src={props.iconSrc}/>
    </a>
  )
};

const StyledIconLink = styled(IconLink)`
  margin: 0 5px;
`;

const Name = styled.div`
  display: inline-block;
  margin-bottom: 10px;
`;

const Author: React.FunctionComponent = (props) => {
  return (
    <AuthorSC>
      <Name>&#169; Samuel Li</Name><StyledIconLink href="mailto:samli@samuelli.net" alt="email icon" iconSrc={emailIcon}/><StyledIconLink href="https://github.com/hingyeung/find-parking-ui" target="_blank" alt="github icon" iconSrc={githubIcon}/>
    </AuthorSC>
  )
};

export default Author;
