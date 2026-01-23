import { useState, useCallback } from 'react';

export const useTextEditor = () => {
	const [text, setText] = useState('');
	const [errors, setErrors] = useState<string[]>([]);
	const [title, setTitle] = useState<string | null>(null);
	const [isChecking, setIsChecking] = useState(false);

	const checkSpellingAndGrammar = useCallback(async () => {
		if (!text.trim()) {
			setErrors([]);
			setTitle(null);
			return;
		}

		setIsChecking(true);
		const lines = text.split('\n');
		const allErrors: string[] = [];
		let firstErrorTitle: string | null = null;

		for (const line of lines) {
			if (line.trim()) {
				try {
					const response = await fetch('https://api.languagetoolplus.com/v2/check', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
						body: new URLSearchParams({
							text: line,
							language: 'en-US',
						}).toString(),
					});

					if (!response.ok) {
						const errorText = await response.text();
						console.error('Error response:', errorText);
						throw new Error(`Error: ${response.status} ${response.statusText}`);
					}

					const data = await response.json();

					if (data.matches?.length > 0) {
						data.matches.forEach((match: any) => {
							if (!firstErrorTitle) {
								firstErrorTitle = match.rule.issueType;
							}
							allErrors.push(match.message);
						});
					}
				} catch (error) {
					console.error('Error checking spelling and grammar:', error);
					allErrors.push('An error occurred while checking this line.');
				}
			}
		}

		if (allErrors.length > 0) {
			setErrors(allErrors);
			setTitle(firstErrorTitle);
		} else {
			setErrors([]);
			setTitle(null);
		}
		setIsChecking(false);
	}, [text]);

	const clearText = useCallback(() => {
		setText('');
		setErrors([]);
		setTitle(null);
	}, []);

	return {
		text,
		setText,
		errors,
		title,
		isChecking,
		checkSpellingAndGrammar,
		clearText,
	};
};

